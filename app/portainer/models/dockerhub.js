import { RegistryTypes } from './registryTypes';

export function DockerHubViewModel() {
  this.Id = 0;
  this.Type = RegistryTypes.ANONYMOUS;
  this.Name = 'DockerHub (匿名)';
  this.URL = 'docker.io';
}
