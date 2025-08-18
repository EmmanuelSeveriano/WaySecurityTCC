// Sistema de Reconhecimento Facial - WaySecurity
class FaceRecognitionSystem {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.stream = null;
        this.isRunning = false;
        this.detectionResults = [];
        this.faceData = null;
    }

    // Inicializar o sistema
    async init() {
        try {
            // Solicitar acesso à câmera
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                } 
            });

            this.video = document.getElementById('video');
            this.canvas = document.getElementById('canvas');
            this.ctx = this.canvas.getContext('2d');

            // Configurar vídeo
            this.video.srcObject = this.stream;
            this.video.play();

            // Configurar canvas
            this.canvas.width = 640;
            this.canvas.height = 480;

            // Aguardar o vídeo carregar
            await new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    resolve();
                };
            });

            // Habilitar botões após inicialização
            this.enableButtons();
            
            this.updateStatus('Câmera inicializada com sucesso!', 'success');
            return true;
        } catch (error) {
            this.updateStatus('Erro ao acessar câmera: ' + error.message, 'error');
            return false;
        }
    }

    // Iniciar detecção facial
    startDetection() {
        if (!this.stream) {
            this.updateStatus('Câmera não inicializada!', 'error');
            return;
        }

        this.isRunning = true;
        this.updateStatus('Detecção facial iniciada...', 'info');
        
        // Habilitar/desabilitar botões apropriados
        document.getElementById('start-detection').disabled = true;
        document.getElementById('stop-detection').disabled = false;
        document.getElementById('capture-photo').disabled = false;
        
        this.detectFaces();
    }

    // Parar detecção
    stopDetection() {
        this.isRunning = false;
        this.updateStatus('Detecção facial parada.', 'info');
        
        // Habilitar/desabilitar botões apropriados
        document.getElementById('start-detection').disabled = false;
        document.getElementById('stop-detection').disabled = true;
    }

    // Detectar faces
    detectFaces() {
        if (!this.isRunning) return;

        // Verificar se o vídeo está pronto
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            // Desenhar frame atual no canvas
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

            // Simular detecção facial (em um sistema real, aqui seria usado uma biblioteca como face-api.js)
            this.simulateFaceDetection();
        }

        // Continuar detecção
        requestAnimationFrame(() => this.detectFaces());
    }

    // Simular detecção facial
    simulateFaceDetection() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        // Simular análise de pixels para detectar faces
        let faceDetected = false;
        let confidence = 0;

        // Algoritmo simples de simulação baseado em variação de cores
        // Analisar apenas uma amostra dos pixels para melhor performance
        for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Detectar tons de pele (simplificado)
            if (r > 100 && g > 80 && b > 60 && r > g && g > b) {
                confidence += 0.05;
            }
        }

        confidence = Math.min(confidence / 100, 1);
        faceDetected = confidence > 0.2;

        if (faceDetected) {
            this.drawFaceBox(confidence);
            this.updateDetectionInfo(faceDetected, confidence);
        } else {
            this.clearFaceBox();
            this.updateDetectionInfo(faceDetected, 0);
        }
    }

    // Desenhar caixa ao redor do rosto detectado
    drawFaceBox(confidence) {
        const boxWidth = 200;
        const boxHeight = 250;
        const x = (this.canvas.width - boxWidth) / 2;
        const y = (this.canvas.height - boxHeight) / 2;

        // Limpar canvas
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        // Desenhar caixa
        this.ctx.strokeStyle = confidence > 0.7 ? '#00ff00' : confidence > 0.4 ? '#ffff00' : '#ff0000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, boxWidth, boxHeight);

        // Adicionar texto de confiança
        this.ctx.fillStyle = this.ctx.strokeStyle;
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Confiança: ${Math.round(confidence * 100)}%`, x, y - 10);
    }

    // Limpar caixa do rosto
    clearFaceBox() {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Capturar foto
    capturePhoto() {
        if (!this.stream) {
            this.updateStatus('Câmera não inicializada!', 'error');
            return;
        }

        // Verificar se o vídeo está pronto
        if (this.video.readyState !== this.video.HAVE_ENOUGH_DATA) {
            this.updateStatus('Aguarde o vídeo carregar completamente!', 'error');
            return;
        }

        // Parar detecção temporariamente
        const wasRunning = this.isRunning;
        if (wasRunning) this.stopDetection();

        // Capturar frame
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Converter para base64
        const photoData = this.canvas.toDataURL('image/jpeg', 0.8);
        
        // Salvar dados da foto
        this.faceData = {
            timestamp: new Date().toISOString(),
            image: photoData,
            confidence: this.detectionResults.length > 0 ? this.detectionResults[this.detectionResults.length - 1].confidence : 0
        };

        // Mostrar foto capturada
        this.showCapturedPhoto(photoData);

        // Retomar detecção se estava ativa
        if (wasRunning) this.startDetection();

        this.updateStatus('Foto capturada com sucesso!', 'success');
    }

    // Mostrar foto capturada
    showCapturedPhoto(photoData) {
        const photoContainer = document.getElementById('captured-photo');
        photoContainer.innerHTML = `
            <h3>Foto Capturada</h3>
            <img src="${photoData}" alt="Foto capturada" style="max-width: 100%; border-radius: 8px;">
            <p>Timestamp: ${new Date().toLocaleString()}</p>
            <button onclick="faceSystem.analyzePhoto()" class="btn btn-primary">Analisar Foto</button>
        `;
        photoContainer.style.display = 'block';
    }

    // Analisar foto capturada
    analyzePhoto() {
        if (!this.faceData) {
            this.updateStatus('Nenhuma foto capturada!', 'error');
            return;
        }

        this.updateStatus('Analisando foto...', 'info');

        // Simular análise
        setTimeout(() => {
            const analysis = this.simulatePhotoAnalysis();
            this.showAnalysisResults(analysis);
        }, 2000);
    }

    // Simular análise da foto
    simulatePhotoAnalysis() {
        const features = [
            'Olhos detectados',
            'Nariz detectado', 
            'Boca detectada',
            'Contorno facial identificado',
            'Pontos faciais mapeados'
        ];

        const emotions = [
            'Neutro', 'Feliz', 'Surpreso', 'Concentrado'
        ];

        const quality = Math.random() > 0.3 ? 'Boa' : 'Baixa';
        const match = Math.random() > 0.5 ? 'Reconhecido' : 'Não reconhecido';

        return {
            features: features.filter(() => Math.random() > 0.2),
            emotion: emotions[Math.floor(Math.random() * emotions.length)],
            quality: quality,
            match: match,
            confidence: Math.random() * 100
        };
    }

    // Mostrar resultados da análise
    showAnalysisResults(analysis) {
        const resultsContainer = document.getElementById('analysis-results');
        resultsContainer.innerHTML = `
            <h3>Resultados da Análise</h3>
            <div class="analysis-grid">
                <div class="analysis-item">
                    <strong>Qualidade da Imagem:</strong> ${analysis.quality}
                </div>
                <div class="analysis-item">
                    <strong>Emoção Detectada:</strong> ${analysis.emotion}
                </div>
                <div class="analysis-item">
                    <strong>Reconhecimento:</strong> ${analysis.match}
                </div>
                <div class="analysis-item">
                    <strong>Confiança:</strong> ${Math.round(analysis.confidence)}%
                </div>
            </div>
            <div class="features-list">
                <strong>Características Detectadas:</strong>
                <ul>
                    ${analysis.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `;
        resultsContainer.style.display = 'block';
        this.updateStatus('Análise concluída!', 'success');
    }

    // Atualizar informações de detecção
    updateDetectionInfo(detected, confidence) {
        const detectionInfo = document.getElementById('detection-info');
        detectionInfo.innerHTML = `
            <div class="detection-status ${detected ? 'detected' : 'not-detected'}">
                <strong>Status:</strong> ${detected ? 'Rosto Detectado' : 'Nenhum Rosto Detectado'}
            </div>
            <div class="detection-confidence">
                <strong>Confiança:</strong> ${Math.round(confidence * 100)}%
            </div>
        `;
    }

    // Habilitar botões após inicialização
    enableButtons() {
        document.getElementById('start-detection').disabled = false;
        document.getElementById('stop-detection').disabled = true;
        document.getElementById('capture-photo').disabled = true;
    }

    // Atualizar status
    updateStatus(message, type) {
        const statusElement = document.getElementById('status');
        statusElement.textContent = message;
        statusElement.className = `status ${type}`;
        
        // Limpar status após 3 segundos
        setTimeout(() => {
            statusElement.textContent = '';
            statusElement.className = 'status';
        }, 3000);
    }

    // Limpar recursos
    cleanup() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        this.isRunning = false;
    }
}

// Instância global do sistema
let faceSystem;

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    faceSystem = new FaceRecognitionSystem();
    
    // Configurar botões
    document.getElementById('init-camera').addEventListener('click', async () => {
        await faceSystem.init();
    });
    
    document.getElementById('start-detection').addEventListener('click', () => {
        faceSystem.startDetection();
    });
    
    document.getElementById('stop-detection').addEventListener('click', () => {
        faceSystem.stopDetection();
    });
    
    document.getElementById('capture-photo').addEventListener('click', () => {
        faceSystem.capturePhoto();
    });
});

// Limpar recursos quando a página for fechada
window.addEventListener('beforeunload', () => {
    if (faceSystem) {
        faceSystem.cleanup();
    }
});
