
export class SyncArticleUseCase {
  async execute(bibtex: string, doi: string) {
    // Por enquanto, apenas logamos para confirmar que a conexão n8n -> NestJS funciona
    console.log('🚀 BibTeX recebido com sucesso!');
    console.log('DOI:', doi);
    console.log('Conteúdo:', bibtex.substring(0, 100) + '...');

    return {
      message: 'Sincronização iniciada',
      timestamp: new Date().toISOString(),
    };
  }
}