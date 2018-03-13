namespace ApiConstruct.Models
{
    public class ExceptionBus : System.Exception
    {
        public ExceptionBus() { }
        public ExceptionBus(string message) : base(message) { }
        public ExceptionBus(string message, System.Exception inner) : base(message, inner) { }
        protected ExceptionBus(
            System.Runtime.Serialization.SerializationInfo info,
            System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }

}