using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Dtos
{
    public record ExtractImageDto
    {
        public Guid InventoryId {  get; set; }
        public string LanguageName { get; set; }
        public string ImageUri { get; set;  }
        public string ImageType { get; set; }
    }
}
