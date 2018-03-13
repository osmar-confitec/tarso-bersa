namespace ApiConstruct.Models
{
    public class CNPJ : Document
    {
        public CNPJ(string documento) : base(documento)
        {

        }

        protected override void FormatDocument()
        {
            throw new System.NotImplementedException();
        }

        protected override bool IsValid(string documento)
        {
            throw new System.NotImplementedException();
        }
    }
}