FROM python:3.13-slim

# Mostra a saída dos programas na hora e não cria arquivos .pyc na pasta da aula.
# UVICORN_HOST e UVICORN_RELOAD fazem o `uvicorn main:app` já abrir para o navegador
# (0.0.0.0) e reiniciar sozinho ao salvar, sem precisar de flags.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONIOENCODING=utf-8 \
    UVICORN_HOST=0.0.0.0 \
    UVICORN_RELOAD=true

# Dependências já instaladas: FastAPI + uvicorn (projetos 1 e 2) e Django (projeto 3)
RUN pip install --no-cache-dir "fastapi==0.115.*" "uvicorn[standard]==0.34.*" "django==5.2.*"

# Terminal mais amigável: prompt com a pasta atual e uma dica do projeto (variável DICA)
RUN echo 'PS1="\[\e[1;32m\]aula-2\[\e[0m\]:\[\e[1;34m\]\w\[\e[0m\]\$ "' >> /root/.bashrc \
 && echo 'alias ll="ls -la"' >> /root/.bashrc \
 && echo '[ -n "$DICA" ] && printf "%b\n" "$DICA"' >> /root/.bashrc

WORKDIR /app

# Ao subir, o container abre um terminal bash (veja o docker-compose.yml)
CMD ["bash"]
