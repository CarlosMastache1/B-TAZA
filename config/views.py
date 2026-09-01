from django.shortcuts import render

def landing_page(request):
    return render(request, 'index.html')

def sobre_nosotros(request):
    return render(request, 'sobre_nosotros.html')

def historia(request):
    return render(request, 'historia.html')

def precios(request):
    return render(request, 'precios.html')

def productos(request):
    return render(request, 'productos.html')


def contacto(request):
    return render(request, 'contacto.html')


import yfinance as yf
from django.shortcuts import render
import json



def precios(request):
    try:
        fx_data = yf.Ticker("MXN=X").history(period="1d")
        fx_rate = fx_data['Close'].iloc[-1]
    except:
        fx_rate = 20.00 

    # 1. ARÁBICA (Solo precio actual para el widget de TradingView)
    try:
        arabica_data = yf.Ticker("KC=F").history(period="1d")
        arabica_price = arabica_data['Close'].iloc[-1]
        precio_arabica = round((arabica_price / 100) * fx_rate * 2.20462, 2)
    except:
        precio_arabica = "ND"

    # 2. ROBUSTA (Precio actual + Historial para Chart.js)
    fechas_robusta = []
    precios_robusta = []
    try:
        # Descargamos 3 meses de historia
        robusta_history = yf.Ticker("RC=F").history(period="3mo")
        precio_robusta = round((robusta_history['Close'].iloc[-1] / 1000) * fx_rate, 2)

        # Preparamos los datos matemáticos para la gráfica
        for index, row in robusta_history.iterrows():
            fecha_str = index.strftime('%Y-%m-%d')
            precio_convertido = round((row['Close'] / 1000) * fx_rate, 2)
            fechas_robusta.append(fecha_str)
            precios_robusta.append(precio_convertido)
    except Exception as e:
        print(f"Error Robusta: {e}")
        precio_robusta = "ND"

    return render(request, 'precios.html', {
        'precio_arabica': precio_arabica,
        'precio_robusta': precio_robusta,
        'fechas_robusta': json.dumps(fechas_robusta), # Enviamos listas en formato JSON
        'precios_robusta': json.dumps(precios_robusta)
    })