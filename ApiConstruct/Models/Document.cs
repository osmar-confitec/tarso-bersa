using System.Text.RegularExpressions;

namespace ApiConstruct.Models
{
    public abstract class Document
    {
        protected string documentoIdentificacao;

        public virtual string DocumentoIdentificacao
        {
            get
            {
                return documentoIdentificacao;
            }
            set
            {
                documentoIdentificacao = value;
            }
        }
        protected abstract void FormatDocument();
        protected abstract bool IsValid(string documento);

        protected string RemoveEspecialChar(string texto)
        {
            return Regex.Replace(texto, @"\D", "");
        }

          protected string GetDocumentNoFormat()
        {
            if (DocumentoIdentificacao!=null)
             DocumentoIdentificacao = Regex.Replace(DocumentoIdentificacao, "[^0-9]", "");
            return DocumentoIdentificacao;
        }
        protected Document(string documento)
        {
            DocumentoIdentificacao = RemoveEspecialChar(documento);

            if (!IsValid(DocumentoIdentificacao) && !string.IsNullOrEmpty(DocumentoIdentificacao)) throw new ExceptionBus("  ");
        }

       
    }
}