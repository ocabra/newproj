CREATE TYPE "public"."alert_status" AS ENUM('open', 'acknowledged', 'resolved', 'retracted');--> statement-breakpoint
CREATE TYPE "public"."event_scope" AS ENUM('entity', 'group');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'retracted');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('judicial_recovery_filed', 'bankruptcy_filed', 'ccee_disconnection', 'retailer_disqualification', 'mcp_default_listed', 'extrajudicial_recovery', 'balanced_operation', 'leverage_band_worsened', 'protest_relevant', 'leverage_band_improved', 'governance_change', 'other_public_notice');--> statement-breakpoint
CREATE TYPE "public"."guarantee_type" AS ENUM('none', 'bank_guarantee', 'insurance', 'deposit', 'other');--> statement-breakpoint
CREATE TYPE "public"."import_kind" AS ENUM('contracts', 'leverage');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('owner', 'member', 'admin', 'curator');--> statement-breakpoint
CREATE TYPE "public"."org_status" AS ENUM('pending', 'approved', 'rejected', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."org_type" AS ENUM('manager', 'consumer', 'supplier', 'operator');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('critical', 'high', 'info');--> statement-breakpoint
CREATE TYPE "public"."submarket" AS ENUM('SE_CO', 'S', 'NE', 'N');--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"contract_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"rule_version" text NOT NULL,
	"severity" "severity" NOT NULL,
	"status" "alert_status" DEFAULT 'open' NOT NULL,
	"reasons" jsonb NOT NULL,
	"snapshot" jsonb NOT NULL,
	"exposure" jsonb,
	"status_changed_at" timestamp with time zone,
	"status_changed_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" text NOT NULL,
	"prefix" text NOT NULL,
	"secret_hash" text NOT NULL,
	"scopes" text[] NOT NULL,
	"created_by" uuid NOT NULL,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_prefix_unique" UNIQUE("prefix")
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"org_id" uuid,
	"actor_user_id" uuid,
	"actor_api_key_id" uuid,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" text,
	"meta" jsonb,
	"ip" text
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"legal_name" text NOT NULL,
	"cnpj" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"site_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"volume_mwm" numeric(10, 4) NOT NULL,
	"price_brl_per_mwh" numeric(10, 2) NOT NULL,
	"guarantee_brl" numeric(14, 2),
	"guarantee_type" "guarantee_type" DEFAULT 'none' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "contracts_period" CHECK ("contracts"."end_date" >= "contracts"."start_date"),
	CONSTRAINT "contracts_volume" CHECK ("contracts"."volume_mwm" > 0 and "contracts"."volume_mwm" <= 1000),
	CONSTRAINT "contracts_price" CHECK ("contracts"."price_brl_per_mwh" >= 0 and "contracts"."price_brl_per_mwh" <= 5000),
	CONSTRAINT "contracts_guarantee" CHECK ("contracts"."guarantee_brl" is null or "contracts"."guarantee_brl" >= 0)
);
--> statement-breakpoint
CREATE TABLE "data_mandates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"text_version" text NOT NULL,
	"context" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid NOT NULL,
	"type" "event_type" NOT NULL,
	"scope" "event_scope" DEFAULT 'entity' NOT NULL,
	"event_date" date NOT NULL,
	"source_published_on" date NOT NULL,
	"source_url" text NOT NULL,
	"source_name" text NOT NULL,
	"summary" text NOT NULL,
	"caveat" text,
	"status" "event_status" DEFAULT 'draft' NOT NULL,
	"created_by" uuid NOT NULL,
	"published_at" timestamp with time zone,
	"published_by" uuid,
	"retracted_at" timestamp with time zone,
	"retracted_by" uuid,
	"retraction_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"kind" "import_kind" NOT NULL,
	"filename" text NOT NULL,
	"rows_total" integer NOT NULL,
	"rows_ok" integer NOT NULL,
	"rows_rejected" integer NOT NULL,
	"errors" jsonb NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" "member_role" NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "leverage_observations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid NOT NULL,
	"week_start" date NOT NULL,
	"band_rank" integer NOT NULL,
	"value" numeric(12, 4),
	"source_name" text NOT NULL,
	"source_url" text NOT NULL,
	"import_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"user_id" uuid NOT NULL,
	"org_id" uuid NOT NULL,
	"role" "member_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "memberships_user_id_org_id_pk" PRIMARY KEY("user_id","org_id")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "org_type" NOT NULL,
	"cnpj" text,
	"status" "org_status" DEFAULT 'pending' NOT NULL,
	"supplier_id" uuid,
	"approved_at" timestamp with time zone,
	"approved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reference_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submarket" "submarket" NOT NULL,
	"reference_date" date NOT NULL,
	"price_brl_per_mwh" numeric(10, 2) NOT NULL,
	"source_name" text NOT NULL,
	"source_url" text NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reference_prices_price" CHECK ("reference_prices"."price_brl_per_mwh" > 0 and "reference_prices"."price_brl_per_mwh" <= 5000)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" text NOT NULL,
	"user_id" uuid NOT NULL,
	"org_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"name" text NOT NULL,
	"submarket" "submarket" NOT NULL,
	"distributor" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "supplier_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"supplier_org_id" uuid NOT NULL,
	"author_user_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cnpj" text NOT NULL,
	"legal_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "suppliers_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_mandates" ADD CONSTRAINT "data_mandates_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "imports" ADD CONSTRAINT "imports_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leverage_observations" ADD CONSTRAINT "leverage_observations_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_responses" ADD CONSTRAINT "supplier_responses_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_responses" ADD CONSTRAINT "supplier_responses_supplier_org_id_organizations_id_fk" FOREIGN KEY ("supplier_org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "alerts_contract_event" ON "alerts" USING btree ("contract_id","event_id");--> statement-breakpoint
CREATE INDEX "alerts_org" ON "alerts" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "audit_org_at" ON "audit_events" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "clients_org_cnpj_active" ON "clients" USING btree ("org_id","cnpj") WHERE deleted_at is null;--> statement-breakpoint
CREATE INDEX "clients_org" ON "clients" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "contracts_org" ON "contracts" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "contracts_supplier" ON "contracts" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "events_supplier" ON "events" USING btree ("supplier_id");--> statement-breakpoint
CREATE UNIQUE INDEX "leverage_supplier_week" ON "leverage_observations" USING btree ("supplier_id","week_start");--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_user_unique" ON "memberships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sites_org" ON "sites" USING btree ("org_id");