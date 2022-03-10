import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class ProductoDto {

    @IsNotBlank({message: 'Este nome pode estar vazio'})
    name?: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(10, {message: 'O preço deve ser pelo menos 10 R$'})
    precio?: number;
}