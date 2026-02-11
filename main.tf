terraform {
  required_providers {
    # https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

variable "APP_DEV_MODE" {
  type = string
}
variable "APP_ENV_CODE" {
  type = string
}
variable "APP_ENV_NAME" {
  type = string
}
variable "APP_KRAMERIUS_URL" {
  type = string
}
variable "APP_ELASTIC_URL" {
  type = string
}
variable "APP_ELASTIC_LOGIN" {
  type = string
}
variable "APP_ELASTIC_PASSWORD" {
  type = string
}

variable "docker_host_uri" {
  type = string
}

variable "docker_image" {
  type = string
}

variable "docker_tag" {
  type    = string
  default = "latest"
}

variable "deploy_domain" {
  type = string
}

variable "docker_container_name" {
  type = string
}

variable "ghcr_username" {
  type = string
}

variable "ghcr_token" {
  type = string
}

provider "docker" {
  host     = var.docker_host_uri
  ssh_opts = ["-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null"]
  registry_auth {
    address  = "ghcr.io"
    username = var.ghcr_username
    password = var.ghcr_token
  }
}

# Creating Docker Image data source
data "docker_registry_image" "moll_frontend" {
  name = "${var.docker_image}:${var.docker_tag}"
}

# Creating moll_frontend Docker Image with the `latest` as the Tag.
resource "docker_image" "moll_frontend" {
  name          = data.docker_registry_image.moll_frontend.name
  pull_triggers = [data.docker_registry_image.moll_frontend.sha256_digest]
}

# Create Docker Container using the moll_frontend image.
resource "docker_container" "moll_frontend" {
  memory            = 256
  count             = 1
  image             = docker_image.moll_frontend.image_id
  name              = var.docker_container_name
  must_run          = true
  publish_all_ports = true
  env = [
    "APP_DEV_MODE=${var.APP_DEV_MODE}",
    "APP_ENV_NAME=${var.APP_ENV_NAME}",
    "APP_ENV_CODE=${var.APP_ENV_CODE}",
    "APP_KRAMERIUS_URL=${var.APP_KRAMERIUS_URL}",
    "APP_ELASTIC_URL=${var.APP_ELASTIC_URL}",
    "APP_ELASTIC_LOGIN=${var.APP_ELASTIC_LOGIN}",
    "APP_ELASTIC_PASSWORD=${var.APP_ELASTIC_PASSWORD}"
  ]

  labels {
    label = "traefik.http.routers.${var.docker_container_name}.rule"
    value = "Host(`${var.deploy_domain}`)"
  }
  labels {
    label = "traefik.http.routers.${var.docker_container_name}.tls"
    value = true
  }
  labels {
    label = "traefik.http.routers.${var.docker_container_name}.tls.certresolver"
    value = "myresolver"
  }
}
