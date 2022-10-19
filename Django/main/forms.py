from .models import User
from django.forms import ModelForm, TextInput

class UserForm(ModelForm):
    class Meta:
        model = User
        fields = ["userName", "userSurname", "UserPatronymic"]
        widgets = {
            "userName": TextInput(attrs={
                'placeholder': 'Имя',
                'class': 'form'
            }),
            "userSurname": TextInput(attrs={
                'placeholder': 'Фамилия',
                'class': 'form'
            }),
            "UserPatronymic": TextInput(attrs={
                'placeholder': 'Отчество',
                'class': 'form'
            }),
        }
