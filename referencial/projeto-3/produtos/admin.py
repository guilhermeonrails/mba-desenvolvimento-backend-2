# Registro do modelo Produto no painel de administração
# Traz o módulo do painel de administração
from django.contrib import admin
# Traz o modelo Produto, que está na mesma pasta
from .models import Produto

# Registra o modelo: o painel passa a oferecer o CRUD de produtos
admin.site.register(Produto)
