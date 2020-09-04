import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Comentario} from './comentario.model';
import {Denuncia} from './denuncia.model';
import {Muro} from './muro.model';
import {Usuario} from './usuario.model';

@model({settings: {strict: false}})
export class Publicacion extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_publicacion?: string;

  @belongsTo(() => Usuario)
  usuarioId: string;

  @property({
    type: 'string',
    required: true,
  })
  texto: string;

  @property({
    type: 'string',
    required: true,
  })
  urlImagen: string;

  @property({
    type: 'string',
    required: true,
  })
  fecha: string;

  @property({
    type: 'number',
    required: true,
  })
  compartido: number;

  @hasMany(() => Usuario)
  me_gusta:string;

  @hasMany(() => Usuario)
  no_gusta: string;


  @belongsTo(() => Muro)
  muroId: string;

  @hasMany(() => Denuncia)
  denuncias: Denuncia[];

  @hasMany(() => Comentario)
  comentarios: Comentario[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Publicacion>) {
    super(data);
  }
}

export interface PublicacionRelations {
  // describe navigational properties here
}

export type PublicacionWithRelations = Publicacion & PublicacionRelations;
