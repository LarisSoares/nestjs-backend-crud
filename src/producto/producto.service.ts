import { ProductoDto } from './dto/producto.dto';
import { ProductoRepository } from './producto.repository';
import { ProductoEntity } from './producto.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class ProductoService {

    constructor(
        @InjectRepository(ProductoEntity)
        private productoRepository: ProductoRepository
    ) { }

    async getAll(): Promise<ProductoEntity[]> {
        const list = await this.productoRepository.find();
        if (!list.length) {
            throw new NotFoundException(new MessageDto('A lista está vazia'));
        }
        return list;
    }

    async findById(id: number): Promise<ProductoEntity> {
        const producto = await this.productoRepository.findOne(id);
        if (!producto) {
            throw new NotFoundException(new MessageDto('não existe'));
        }
        return producto;
    }

    async findByName(name: string): Promise<ProductoEntity> {
        const producto = await this.productoRepository.findOne({ name: name });
        return producto;
    }

    async create(dto: ProductoDto): Promise<any> {
        const exists = await this.findByName(dto.name);
        if (exists) throw new BadRequestException(new MessageDto('esse nome já existe'));
        const producto = this.productoRepository.create(dto);
        await this.productoRepository.save(producto);
        return new MessageDto(`producto ${producto.name} criado`);
    }

    async update(id: number, dto: ProductoDto): Promise<any> {
        const producto = await this.findById(id);
        if (!producto)
            throw new NotFoundException(new MessageDto('não existe'));
        const exists = await this.findByName(dto.name);
        if (exists && exists.id !== id) throw new BadRequestException(new MessageDto('esse produto já existe'));
        dto.name ? producto.name = dto.name : producto.name = producto.name;
        dto.precio ? producto.precio = dto.precio : producto.precio = producto.precio;
        await this.productoRepository.save(producto);
        return new MessageDto(`producto ${producto.name} actualizado`);
    }

    async delete(id: number): Promise<any> {
        const producto = await this.findById(id);
        await this.productoRepository.delete(producto);
        return new MessageDto(`producto ${producto.name} eliminado`);
    }
}
