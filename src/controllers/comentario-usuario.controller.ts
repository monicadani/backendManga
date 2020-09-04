import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Comentario,
  Usuario,
} from '../models';
import {ComentarioRepository} from '../repositories';

export class ComentarioUsuarioController {
  constructor(
    @repository(ComentarioRepository)
    public comentarioRepository: ComentarioRepository,
  ) { }

  @get('/comentarios/{id}/usuario', {
    responses: {
      '200': {
        description: 'Usuario belonging to Comentario',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Usuario)},
          },
        },
      },
    },
  })
  async getUsuario(
    @param.path.string('id') id: typeof Comentario.prototype.id_comentario,
  ): Promise<Usuario> {
    return this.comentarioRepository.usuario(id);
  }
}
