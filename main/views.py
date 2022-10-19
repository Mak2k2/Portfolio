from django.shortcuts import render, redirect
from .models import User
from .forms import UserForm

def index(request):
    error = ''
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/')
        else:
            error = "Форма заполнена неврно"

    form = UserForm()
    fullUserName = User.objects.all()
    context = {
        'form': form,
        'title': 'Главная страница !',
        'users': fullUserName
    }
    return render(request, 'main/index.html', context)
