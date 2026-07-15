import type { ExceptionMap } from '../../../../shared/domain/exceptions/app.exception';

export const ReadingEx = {
  ArticleNotFound: {
    code: 'READING_ARTICLE_NOT_FOUND',
    message: 'Article not found',
    httpStatus: 404,
  },
  ArticleForbidden: {
    code: 'READING_ARTICLE_FORBIDDEN',
    message: 'You do not have permission to access this article',
    httpStatus: 403,
  },
} satisfies ExceptionMap;
