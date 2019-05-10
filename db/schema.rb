# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_05_07_202712) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "order_items", force: :cascade do |t|
    t.integer "order_id", null: false
    t.integer "product_item_id", null: false
    t.index ["product_item_id", "order_id"], name: "index_order_items_on_product_item_id_and_order_id", unique: true
    t.index ["product_item_id"], name: "index_order_items_on_product_item_id"
  end

  create_table "orders", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "delivery_type"
    t.string "shipping_state"
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "product_items", force: :cascade do |t|
    t.integer "product_id", null: false
    t.string "size"
    t.string "state"
    t.index ["state"], name: "index_product_items_on_state"
  end

  create_table "products", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "product_code", null: false
    t.string "title"
    t.string "description"
    t.string "model_size"
    t.string "model_height"
    t.string "fabric_stretch"
    t.string "fabric_material"
    t.string "main_fiber_content"
    t.string "care_advice"
    t.string "care_instructions"
    t.decimal "price", null: false
    t.decimal "markdown"
    t.index ["title"], name: "index_products_on_title"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "session_token", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.date "date_of_birth"
    t.string "gender", null: false
    t.string "country", null: false
    t.string "email_lists", default: [], array: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["session_token"], name: "index_users_on_session_token"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "product_items", "products"
end
