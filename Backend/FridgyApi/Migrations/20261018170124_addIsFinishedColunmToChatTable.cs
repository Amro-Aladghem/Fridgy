using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FridgyApi.Migrations
{
    /// <inheritdoc />
    public partial class addIsFinishedColunmToChatTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Data",
                table: "Chats",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFinished",
                table: "Chats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowMessage",
                table: "Chats",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "ChatRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "InventoryAgent");

            migrationBuilder.UpdateData(
                table: "ChatRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "MonitorAgent");

            migrationBuilder.UpdateData(
                table: "ChatRoles",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "ShoppingListAgent");

            migrationBuilder.InsertData(
                table: "ChatRoles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 4, "User" },
                    { 5, "Tool" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ChatRoles",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ChatRoles",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DropColumn(
                name: "Data",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "IsFinished",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "ShowMessage",
                table: "Chats");

            migrationBuilder.UpdateData(
                table: "ChatRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Agent");

            migrationBuilder.UpdateData(
                table: "ChatRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "User");

            migrationBuilder.UpdateData(
                table: "ChatRoles",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Tool");
        }
    }
}
