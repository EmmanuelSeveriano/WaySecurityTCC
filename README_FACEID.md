# Sistema de Reconhecimento Facial - WaySecurity

## Descrição
Este é um sistema de teste de reconhecimento facial desenvolvido para o TCC da WaySecurity. A página permite capturar fotos através da webcam e simular a análise facial, exibindo resultados em tempo real.

## Funcionalidades

### ✅ Implementadas
- **Inicialização da Câmera**: Acesso à webcam do usuário
- **Captura de Fotos**: Captura de imagens em tempo real
- **Análise Facial Simulada**: Simulação de detecção de características faciais
- **Exibição de Horário**: Registro do momento do reconhecimento
- **Interface Responsiva**: Design adaptável para diferentes dispositivos
- **Status em Tempo Real**: Feedback visual do processo

### 🔮 Para Implementação Futura
- **API Real de Reconhecimento**: Integração com Face-API.js ou similar
- **Base de Dados**: Armazenamento de rostos conhecidos
- **Autenticação**: Sistema de login via reconhecimento facial
- **Histórico**: Registro de todas as tentativas de reconhecimento

## Como Usar

### 1. Acessar a Página
- Abra o arquivo `faceid.html` em um navegador moderno
- Certifique-se de que o navegador tem acesso à webcam

### 2. Inicializar a Câmera
- Clique no botão "Inicializar Câmera"
- Permita o acesso à webcam quando solicitado
- Aguarde a mensagem de confirmação

### 3. Capturar e Analisar
- Posicione seu rosto na câmera
- Clique em "Capturar e Analisar"
- Aguarde o processamento (simulado)

### 4. Visualizar Resultados
- A foto capturada será exibida
- Os resultados da análise aparecerão abaixo
- O horário do reconhecimento será mostrado

## Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilização e responsividade
- **JavaScript ES6+**: Lógica de funcionamento
- **WebRTC**: Acesso à câmera
- **Canvas API**: Processamento de imagens

## Requisitos do Sistema

- Navegador moderno (Chrome 60+, Firefox 55+, Safari 11+)
- Webcam funcional
- Conexão HTTPS (para acesso à câmera em produção)

## Estrutura dos Arquivos

```
faceid.html      # Página principal
faceid.css       # Estilos e layout
faceid.js        # Lógica de reconhecimento facial
README_FACEID.md # Este arquivo
```

## Personalização

### Cores
As cores podem ser alteradas editando as variáveis CSS no arquivo `faceid.css`:

```css
:root {
    --azul: #0d7cc4;        /* Azul principal */
    --azul-escuro: #00a8e1; /* Azul escuro */
    --azul-claro: #5ed4f3;  /* Azul claro */
    /* ... outras variáveis */
}
```

### Funcionalidades
Para implementar reconhecimento facial real, substitua a função `simulateFacialAnalysis()` no arquivo `faceid.js` por uma chamada para uma API real como:
- Face-API.js
- Google Cloud Vision API
- Azure Face API
- AWS Rekognition

## Suporte

Para dúvidas ou problemas:
- Verifique se a webcam está funcionando
- Confirme as permissões do navegador
- Teste em diferentes navegadores
- Verifique o console do navegador para erros

## Licença

Este projeto foi desenvolvido para fins educacionais como parte do TCC da WaySecurity.

---

**Desenvolvido por:** Equipe WaySecurity  
**Versão:** 1.0.0  
**Data:** 2025

