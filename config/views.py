from django.shortcuts import render

def landing_page(request):
    return render(request, 'index.html')

def sobre_nosotros(request):
    return render(request, 'sobre_nosotros.html')

def historia(request):
    return render(request, 'historia.html')

def precios(request):
    return render(request, 'precios.html')