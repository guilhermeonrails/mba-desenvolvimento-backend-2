# Projeto 3 — comandos rodados no terminal do container (docker compose run --rm --service-ports projeto-3)

# Cria o projeto Django (pasta config + manage.py) na pasta atual
django-admin startproject config .

# Liga o servidor de desenvolvimento (Ctrl+C para parar)
python manage.py runserver 0.0.0.0:8000

# Cria o app produtos, com models.py e admin.py prontos para editar
python manage.py startapp produtos

# Gera o arquivo de migração com a tabela Produto
python manage.py makemigrations
# Aplica as migrações: cria as tabelas no banco db.sqlite3
python manage.py migrate

# Cria o usuário administrador (pede nome, e-mail e senha)
python manage.py createsuperuser

# Liga o servidor de novo para entrar em /admin
python manage.py runserver 0.0.0.0:8000
