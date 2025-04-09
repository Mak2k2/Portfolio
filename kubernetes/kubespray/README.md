# Рабочая сборка k8s

![Kubernetes Logo](https://raw.githubusercontent.com/kubernetes-sigs/kubespray/master/docs/img/kubernetes-logo.png)

CNI - Calico
CRI - Containerd

Добавлен Helm и Metrics Server

## Запуск
```bash
sudo apt install python3-pip -y
pip3 install -r requirements.txt
sudo apt install ansible -y
ansible-playbook cluster.yml -i inventory/k8s_cluster/inventory.ini -b -D -vv
```
