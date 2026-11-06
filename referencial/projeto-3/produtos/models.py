# Modelos do app produtos
# Traz o módulo de modelos do Django
from django.db import models

# Cada classe que herda de Model vira uma tabela no banco
class Produto(models.Model):
    # Nome do produto: texto curto de até 100 letras
    nome = models.CharField(max_length=100)
    # Descrição: texto longo e opcional
    descricao = models.TextField(blank=True)
    # Preço: até 10 dígitos, com 2 casas decimais
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    # Estoque: número inteiro sem negativos, começa em 0
    estoque = models.PositiveIntegerField(default=0)

    # Define como o produto aparece escrito (no painel, por exemplo)
    def __str__(self):
        # Mostra o nome do produto em vez de 'Produto object (1)'
        return self.nome
