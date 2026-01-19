import { MigrationInterface, QueryRunner } from 'typeorm';

export class SettingUp1768831979671 implements MigrationInterface {
  name = 'SettingUp1768831979671';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "url" text NOT NULL, "file_name" character varying(255), "mime_type" character varying(120), "size_bytes" bigint, "owner_type" "public"."assets_owner_type_enum", "owner_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c1a19bd7f2a4f04eac174bd126" ON "assets" ("owner_type", "owner_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_95e68ec694262926f1af7176a1" ON "assets" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "email_verification_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "code_hash" character varying(255) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "attempt_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_5bb1cbeebcbcb38996911bff8d4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_581ce944ea5ab6f4efd9fa64cc" ON "email_verification_codes" ("expires_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d18df5dff26676faed7d3e1640" ON "email_verification_codes" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "password_reset_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "code_hash" character varying(255) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "attempt_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_f3a88f7bc4536c53f2b277a0b56" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_756e7aedffd312c673850a660b" ON "password_reset_codes" ("expires_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_421ca49f5a7b180365035267ca" ON "password_reset_codes" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "balance_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" "public"."balance_history_type_enum" NOT NULL, "amount" numeric(14,2) NOT NULL, "balance_before" numeric(14,2) NOT NULL, "balance_after" numeric(14,2) NOT NULL, "currency" character(3) NOT NULL, "entity_type" character varying(40), "entity_id" uuid, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_dc0b0a31a6896d2e4fd3f08042c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0dcb2d7814c63c78fad1e3ab6b" ON "balance_history" ("entity_type", "entity_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6c4d65af0bac6dc6e904809b9" ON "balance_history" ("user_id", "type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e015332a9b65438bf092f6a24f" ON "balance_history" ("user_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "debts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "personal_name" character varying(160) NOT NULL, "direction" "public"."debts_direction_enum" NOT NULL DEFAULT 'I_OWE', "amount" numeric(14,2) NOT NULL, "currency" character(3) NOT NULL, "due_date" date NOT NULL, "description" text, "status" "public"."debts_status_enum" NOT NULL DEFAULT 'UNPAID', "reminder_enabled" boolean NOT NULL DEFAULT false, "remind_at" TIMESTAMP WITH TIME ZONE, "asset_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_4bd9f54aab9e59628a3a2657fa1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f822eb994fc63b58e7bafd8a67" ON "debts" ("asset_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b295e31d12e71f9b2b72fd4308" ON "debts" ("reminder_enabled", "remind_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7f48b6f1f321b1ec9fdda6648b" ON "debts" ("user_id", "due_date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_abc1e08a5d13928a23aa55212b" ON "debts" ("user_id", "status") `,
    );
    await queryRunner.query(
      `CREATE TABLE "bills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "name" character varying(160) NOT NULL, "amount" numeric(14,2) NOT NULL, "currency" character(3) NOT NULL, "status" "public"."bills_status_enum" NOT NULL DEFAULT 'UNPAID', "due_date" date NOT NULL, "description" text, "reminder_enabled" boolean NOT NULL DEFAULT false, "reminder_frequency" "public"."bills_reminder_frequency_enum" NOT NULL DEFAULT 'NONE', "next_remind_at" TIMESTAMP WITH TIME ZONE, "paid_at" TIMESTAMP WITH TIME ZONE, "asset_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_a56215dfcb525755ec832cc80b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6b10368fb7a49c9a16c53339a4" ON "bills" ("asset_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_62fe3254bbe46f9c1ac11f306b" ON "bills" ("reminder_enabled", "next_remind_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8b036872c5d5533355960d215a" ON "bills" ("user_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_79b94761999663211b69a08e6f" ON "bills" ("user_id", "due_date") `,
    );
    await queryRunner.query(
      `CREATE TABLE "expenses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "name" character varying(160) NOT NULL, "amount" numeric(14,2) NOT NULL, "currency" character(3) NOT NULL, "category" "public"."expenses_category_enum" NOT NULL DEFAULT 'OTHER', "due_date" date NOT NULL, "description" text, "reminder_enabled" boolean NOT NULL DEFAULT false, "reminder_frequency" "public"."expenses_reminder_frequency_enum" NOT NULL DEFAULT 'NONE', "next_remind_at" TIMESTAMP WITH TIME ZONE, "asset_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3b5f9445c8bea3940cd5a8fea6" ON "expenses" ("asset_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9e41b7bec6393d5e4f2c4e5751" ON "expenses" ("reminder_enabled", "next_remind_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_744221ba4750ed62ba8d86199c" ON "expenses" ("user_id", "category") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4c2aab9e04b751a7623f46ec2c" ON "expenses" ("user_id", "due_date") `,
    );
    await queryRunner.query(
      `CREATE TABLE "income_recurring_rules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "income_id" uuid NOT NULL, "frequency" "public"."income_recurring_rules_frequency_enum" NOT NULL DEFAULT 'ONE_TIME', "next_run_at" date NOT NULL, "end_at" date, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "incomeId" uuid, CONSTRAINT "PK_df916e56e2094f5010ca08d5c61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4bf86389efef2a0024f2795a6a" ON "income_recurring_rules" ("frequency") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2a639e077028e3b182b96afc5a" ON "income_recurring_rules" ("active", "next_run_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "incomes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "amount" numeric(14,2) NOT NULL, "source" "public"."incomes_source_enum" NOT NULL DEFAULT 'SALARY', "description" text, "income_date" date NOT NULL, "asset_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_d737b3d0314c1f0da5461a55e5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8cfb800970e4519f1ab792530f" ON "incomes" ("asset_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1df6f562d67c5989a1059cda15" ON "incomes" ("user_id", "source") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a78c7c26dfb1ebbd7cc47f8c37" ON "incomes" ("user_id", "income_date") `,
    );
    await queryRunner.query(
      `CREATE TABLE "group_invoice_shares" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "group_invoice_id" uuid NOT NULL, "user_id" uuid NOT NULL, "amount_share" numeric(14,2) NOT NULL, "percentage" numeric(5,2), "paid_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "groupInvoiceId" uuid, "userId" uuid, CONSTRAINT "PK_181abff5f462488d0551e0c1134" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3139342009a1ff94d325216860" ON "group_invoice_shares" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_15d097844da815ee6f060001f3" ON "group_invoice_shares" ("group_invoice_id", "user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "group_invoices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by_user_id" uuid NOT NULL, "title" character varying(160) NOT NULL, "amount_total" numeric(14,2) NOT NULL, "currency" character(3) NOT NULL, "status" "public"."group_invoices_status_enum" NOT NULL DEFAULT 'UNPAID', "due_date" date NOT NULL, "split_method" "public"."group_invoices_split_method_enum" NOT NULL DEFAULT 'EQUAL', "description" text, "reminder_enabled" boolean NOT NULL DEFAULT false, "reminder_frequency" "public"."group_invoices_reminder_frequency_enum" NOT NULL DEFAULT 'NONE', "next_remind_at" TIMESTAMP WITH TIME ZONE, "asset_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_603fe0b54d02f0336e3f2fc1199" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1cf7fb3e86429eefb6c492a5d2" ON "group_invoices" ("asset_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7be490f596a7e27890b7dfea13" ON "group_invoices" ("reminder_enabled", "next_remind_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_997e5bbe7b05cfba02bcd0e503" ON "group_invoices" ("created_by_user_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_18c142b93117969bffb29b84b3" ON "group_invoices" ("created_by_user_id", "due_date") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "title" character varying(160) NOT NULL, "body" text, "entity_type" character varying(40), "entity_id" uuid, "data" jsonb, "sent_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_read" boolean NOT NULL DEFAULT false, "read_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aef1c7aef3725068e5540f8f00" ON "notifications" ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d5ace4f24abe554acb1a919656" ON "notifications" ("entity_type", "entity_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_350cc9d1b068af7e42f8864385" ON "notifications" ("user_id", "sent_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_af08fad7c04bb85403970afdc1" ON "notifications" ("user_id", "is_read") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rewards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(160) NOT NULL, "description" text, "points_cost" integer NOT NULL, "icon_asset_id" uuid, "status" "public"."rewards_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3d947441a48debeb9b7366f8b8c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_474dc8443b45551ed448039741" ON "rewards" ("icon_asset_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_315e3ee2a71e042de4311183b2" ON "rewards" ("points_cost") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef98860737d3de5b64ed19254c" ON "rewards" ("status") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_rewards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "reward_id" uuid NOT NULL, "points_spent" integer NOT NULL, "claimed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, "rewardId" uuid, CONSTRAINT "PK_86078010f64a891601beef7c54f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2407370386f8e7e2e41cdecef5" ON "user_rewards" ("reward_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a170a87f8e497c7cd61163aa2" ON "user_rewards" ("user_id", "claimed_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ac2bd8b71206c0b71dbfbb42c4" ON "user_rewards" ("user_id", "reward_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying(120) NOT NULL, "email" character varying(255) NOT NULL, "password_hash" character varying(255), "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "status" "public"."users_status_enum" NOT NULL DEFAULT 'PENDING', "default_currency" character(3) NOT NULL DEFAULT 'USD', "current_balance" numeric(14,2) NOT NULL DEFAULT '0', "points" bigint NOT NULL DEFAULT '0', "avatar_asset_id" uuid, "provider" character varying(20) NOT NULL DEFAULT 'LOCAL', "provider_id" character varying(255), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_0ee622a8e4fad7b194415eb63c" UNIQUE ("avatar_asset_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ee622a8e4fad7b194415eb63c" ON "users" ("avatar_asset_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cdee031d891aee137fb0028767" ON "users" ("points") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3676155292d72c67cd4e090514" ON "users" ("status") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `ALTER TABLE "assets" ADD CONSTRAINT "FK_d8cf9bdec7d2fad0852aec349c1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_verification_codes" ADD CONSTRAINT "FK_97bef998b0d463cb053643822a3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset_codes" ADD CONSTRAINT "FK_9c30b1d4c6199fd152c128dbd37" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" ADD CONSTRAINT "FK_3e799f0d1c9ff376768d9bab2bb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "debts" ADD CONSTRAINT "FK_834960a509c776eb841644a9bac" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "debts" ADD CONSTRAINT "FK_f822eb994fc63b58e7bafd8a67f" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bills" ADD CONSTRAINT "FK_dd941796f5112bc83a7bf499f86" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bills" ADD CONSTRAINT "FK_6b10368fb7a49c9a16c53339a49" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD CONSTRAINT "FK_3d211de716f0f14ea7a8a4b1f2c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD CONSTRAINT "FK_3b5f9445c8bea3940cd5a8fea62" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "income_recurring_rules" ADD CONSTRAINT "FK_8a446b8e679928cec4acf6b0f2b" FOREIGN KEY ("incomeId") REFERENCES "incomes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incomes" ADD CONSTRAINT "FK_f6b7c6bbe04a203dfc67ae627ab" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incomes" ADD CONSTRAINT "FK_8cfb800970e4519f1ab792530f0" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_invoice_shares" ADD CONSTRAINT "FK_eee51fabfd53a67aa38d840d016" FOREIGN KEY ("groupInvoiceId") REFERENCES "group_invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_invoice_shares" ADD CONSTRAINT "FK_21709d3ecfe282545cef8ffb946" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_invoices" ADD CONSTRAINT "FK_eccfee7d96cb14bdd84eb894c15" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_invoices" ADD CONSTRAINT "FK_1cf7fb3e86429eefb6c492a5d2e" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rewards" ADD CONSTRAINT "FK_474dc8443b45551ed4480397414" FOREIGN KEY ("icon_asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_rewards" ADD CONSTRAINT "FK_d538de4678c82491e5a8a8a5834" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_rewards" ADD CONSTRAINT "FK_d2904b4fa623c996161687e47d1" FOREIGN KEY ("rewardId") REFERENCES "rewards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_0ee622a8e4fad7b194415eb63c0" FOREIGN KEY ("avatar_asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_0ee622a8e4fad7b194415eb63c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_rewards" DROP CONSTRAINT "FK_d2904b4fa623c996161687e47d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_rewards" DROP CONSTRAINT "FK_d538de4678c82491e5a8a8a5834"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rewards" DROP CONSTRAINT "FK_474dc8443b45551ed4480397414"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_invoices" DROP CONSTRAINT "FK_1cf7fb3e86429eefb6c492a5d2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_invoices" DROP CONSTRAINT "FK_eccfee7d96cb14bdd84eb894c15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_invoice_shares" DROP CONSTRAINT "FK_21709d3ecfe282545cef8ffb946"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_invoice_shares" DROP CONSTRAINT "FK_eee51fabfd53a67aa38d840d016"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incomes" DROP CONSTRAINT "FK_8cfb800970e4519f1ab792530f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incomes" DROP CONSTRAINT "FK_f6b7c6bbe04a203dfc67ae627ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "income_recurring_rules" DROP CONSTRAINT "FK_8a446b8e679928cec4acf6b0f2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT "FK_3b5f9445c8bea3940cd5a8fea62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT "FK_3d211de716f0f14ea7a8a4b1f2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bills" DROP CONSTRAINT "FK_6b10368fb7a49c9a16c53339a49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bills" DROP CONSTRAINT "FK_dd941796f5112bc83a7bf499f86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "debts" DROP CONSTRAINT "FK_f822eb994fc63b58e7bafd8a67f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "debts" DROP CONSTRAINT "FK_834960a509c776eb841644a9bac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance_history" DROP CONSTRAINT "FK_3e799f0d1c9ff376768d9bab2bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset_codes" DROP CONSTRAINT "FK_9c30b1d4c6199fd152c128dbd37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_verification_codes" DROP CONSTRAINT "FK_97bef998b0d463cb053643822a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assets" DROP CONSTRAINT "FK_d8cf9bdec7d2fad0852aec349c1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3676155292d72c67cd4e090514"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cdee031d891aee137fb0028767"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ee622a8e4fad7b194415eb63c"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ac2bd8b71206c0b71dbfbb42c4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0a170a87f8e497c7cd61163aa2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2407370386f8e7e2e41cdecef5"`,
    );
    await queryRunner.query(`DROP TABLE "user_rewards"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ef98860737d3de5b64ed19254c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_315e3ee2a71e042de4311183b2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_474dc8443b45551ed448039741"`,
    );
    await queryRunner.query(`DROP TABLE "rewards"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_af08fad7c04bb85403970afdc1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_350cc9d1b068af7e42f8864385"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d5ace4f24abe554acb1a919656"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aef1c7aef3725068e5540f8f00"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_18c142b93117969bffb29b84b3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_997e5bbe7b05cfba02bcd0e503"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7be490f596a7e27890b7dfea13"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1cf7fb3e86429eefb6c492a5d2"`,
    );
    await queryRunner.query(`DROP TABLE "group_invoices"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_15d097844da815ee6f060001f3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3139342009a1ff94d325216860"`,
    );
    await queryRunner.query(`DROP TABLE "group_invoice_shares"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a78c7c26dfb1ebbd7cc47f8c37"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1df6f562d67c5989a1059cda15"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8cfb800970e4519f1ab792530f"`,
    );
    await queryRunner.query(`DROP TABLE "incomes"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2a639e077028e3b182b96afc5a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4bf86389efef2a0024f2795a6a"`,
    );
    await queryRunner.query(`DROP TABLE "income_recurring_rules"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4c2aab9e04b751a7623f46ec2c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_744221ba4750ed62ba8d86199c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9e41b7bec6393d5e4f2c4e5751"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3b5f9445c8bea3940cd5a8fea6"`,
    );
    await queryRunner.query(`DROP TABLE "expenses"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_79b94761999663211b69a08e6f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8b036872c5d5533355960d215a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_62fe3254bbe46f9c1ac11f306b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6b10368fb7a49c9a16c53339a4"`,
    );
    await queryRunner.query(`DROP TABLE "bills"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_abc1e08a5d13928a23aa55212b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7f48b6f1f321b1ec9fdda6648b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b295e31d12e71f9b2b72fd4308"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f822eb994fc63b58e7bafd8a67"`,
    );
    await queryRunner.query(`DROP TABLE "debts"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e015332a9b65438bf092f6a24f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e6c4d65af0bac6dc6e904809b9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0dcb2d7814c63c78fad1e3ab6b"`,
    );
    await queryRunner.query(`DROP TABLE "balance_history"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_421ca49f5a7b180365035267ca"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_756e7aedffd312c673850a660b"`,
    );
    await queryRunner.query(`DROP TABLE "password_reset_codes"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d18df5dff26676faed7d3e1640"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_581ce944ea5ab6f4efd9fa64cc"`,
    );
    await queryRunner.query(`DROP TABLE "email_verification_codes"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_95e68ec694262926f1af7176a1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c1a19bd7f2a4f04eac174bd126"`,
    );
    await queryRunner.query(`DROP TABLE "assets"`);
  }
}
