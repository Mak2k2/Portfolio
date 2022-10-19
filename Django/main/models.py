from django.db import models

class User(models.Model):
    userName = models.CharField('Имя', max_length=100)
    userSurname = models.CharField('Фамилия', max_length=100)
    UserPatronymic = models.CharField('Отчество', max_length=100)

    def __str__(self):
        return self.userSurname + " " + self.userName + " " + self.UserPatronymic
