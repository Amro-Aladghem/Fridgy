using Application.Dtos;
using FluentValidation;

namespace Application.Validators
{
    public class ProductDtoValidator : AbstractValidator<ProductDto>
    {
        public ProductDtoValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(p => p.Description)
                .MaximumLength(1000);

            RuleFor(p => p.Quantity)
                .GreaterThanOrEqualTo(0);

            RuleFor(p => p.Price)
                .GreaterThanOrEqualTo(0)
                .When(p => p.Price.HasValue);

            RuleFor(p => p.ProductStatusId)
                .GreaterThan(0);
        }
    }
}
