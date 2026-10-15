using Application.Dtos;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class SysProductService
    {
        private AppDbContext _context { get; set;  }

        public SysProductService(AppDbContext context)
        {
            _context = context;
        }

        private async Task<SysProductSearchResultDto> SearchImageForProduct(SysProductSearchDto searchProduct)
        {
            SysProductSearchResultDto? resultDto = await _context.SysProducts.Where(s => s.Name.Contains(searchProduct.TextSearch))
                .Select(s => new SysProductSearchResultDto()
                {
                    ProductId = searchProduct.ProductId,
                    ImageUrl = s.Url
                })
                .FirstOrDefaultAsync();

            if(resultDto is null)
            {
                return new SysProductSearchResultDto()
                {
                    ProductId = searchProduct.ProductId,
                    ImageUrl = null
                };
            }

            return resultDto;
        }

        public async Task<List<SysProductSearchResultDto>> SearchImagesForProducts(List<SysProductSearchDto> searchProducts)
        {
            List<SysProductSearchResultDto> sysProductSearchResultDtos = new List<SysProductSearchResultDto>();

            foreach (SysProductSearchDto searchProduct in searchProducts)
            {
                sysProductSearchResultDtos.Add(await SearchImageForProduct(searchProduct));
            }

            return sysProductSearchResultDtos;
        }

    }
}
