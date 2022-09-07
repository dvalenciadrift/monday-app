data "terraform_remote_state" "upstream" {
  backend = "s3"
  config = {
    bucket = var.terraform_bucket_name
    region = var.region
    key    = "${var.atmos_env}/terraform.tfstate"
  }
}

