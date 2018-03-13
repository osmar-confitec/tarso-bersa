namespace ApiConstruct.Models
{
    public class CPF : Document
    {
        public CPF(string documento) : base(documento)
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