export class SyncArticleDto {
  doi: string;
  title?: string;
  abstract?: string;
  relevancia_score?: number;
  justificativa?: string;
  parametros_encontrados?: string[];
  decisao?: 'APROVADO' | 'REJEITADO';
}
