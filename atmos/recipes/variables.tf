variable "aws_accounts" {
  description = "Maps environments to account numbers"
  type        = map(string)
  default = {
    ops   = "227298829890"
    qa    = "748875031154"
    local = "748875031154"
    prod  = "745603705374"
    eu    = "745603705374"
  }
}

variable "terraform_bucket_name" {
  description = "The s3 bucket to store terraform state/secrets in"
  default     = "drift-ops-terraform"
}

variable "environment" {
  description = "The platform environment"
}

variable "name_prefix" {
  description = "The prefix used to disambiguate names between different environments"
}

variable "name_postfix" {
  description = "The postfix used to disambiguate names between different environments"
}

variable "domain" {
  description = "The primary domain"
}

variable "internal_domain" {
  description = "The internal domain"
}

variable "aws_region" {
  description = "The aws region"
}

variable "availability_zones" {
  description = "The AWS availability zones to host your network"
  type        = list(string)
}

variable "enable_upstream_zone" {
  description = "Enables registration of primary zone as a sudomain of an upstream zone"
  default     = 0
}

variable "upstream_zone_id" {
  description = "The upstream zone id for which the primary zone is a subdomain"
  default     = ""
}

variable "vpc_cidr" {
  description = "CIDR for VPC"
  default     = "10.10.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR for public subnets"
  type        = list(string)
  default = [
    "10.10.32.0/20",
    "10.10.96.0/20",
  ]
}

variable "private_subnet_cidrs" {
  description = "CIDR for primary private subnet"
  type        = list(string)
  default = [
    "10.10.0.0/19",
    "10.10.64.0/19",
  ]
}

variable "vpn_client_cidr" {
  description = "The cidr to allocate vpn client connections on"
  default     = "192.168.255.0/24"
}

variable "default_db_port" {
  description = "the port of the conversation database"
  default     = 3306
}

variable "service_name" {
  type        = string
  description = "Service name (for app-tagging)"
  default     = "pse-drifttranslator"
}

variable "drift_token" {
  description = "Drift app token for Translator app"
}

variable "google_credentials" {
  description = "Google API's auth keyfile.json"
}

variable "app_name" {
  description = "Name of your custom app"
}





