using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Dtos
{
    public class SysProductSearchDto
    {
        public Guid ProductId { get; set; } 
        public string TextSearch { get; set; }
    }
}
