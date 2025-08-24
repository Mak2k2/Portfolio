#!/bin/bash

USER_NAME="gitlab-runner"
NAMESPACE="default"
CSR_NAME="${USER_NAME}-csr"
CERT_FILE="${USER_NAME}.crt"
KEY_FILE="${USER_NAME}.key"
KUBECONFIG_FILE="config"

# Создание ключа и запроса на выдачу сертификата
openssl genrsa -out $KEY_FILE 2048
openssl req -new -key $KEY_FILE -out $CSR_NAME.csr -subj "/CN=${USER_NAME}/O=dev"

# Запрос на сертификат в k8s
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: ${CSR_NAME}
spec:
  request: $(cat $CSR_NAME.csr | base64 | tr -d '\n')
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 315569260
  usages:
  - client auth
EOF

# Подтверждение запроса на сертификат
kubectl certificate approve ${CSR_NAME}

# Получение сертификата
kubectl get csr ${CSR_NAME} -o jsonpath='{.status.certificate}' | base64 --decode > $CERT_FILE

kubectl config view --raw -o go-template='{{index ((index (index .clusters 0) "cluster")) "certificate-authority-data"|base64decode}}' > ca.crt

# Создание kubeconfig
kubectl config set-cluster kubernetes --server=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}') --certificate-authority=ca.crt --kubeconfig=${KUBECONFIG_FILE}

kubectl config set-credentials ${USER_NAME} --client-certificate=$CERT_FILE --client-key=$KEY_FILE --kubeconfig=${KUBECONFIG_FILE}

kubectl config set-context ${USER_NAME}@kubernetes \
  --cluster=kubernetes \
  --user=${USER_NAME} \
  --namespace=${NAMESPACE} \
  --kubeconfig=${KUBECONFIG_FILE}

kubectl config use-context ${USER_NAME}@kubernetes --kubeconfig=${KUBECONFIG_FILE}

echo "Kubeconfig file created: ${KUBECONFIG_FILE}"
