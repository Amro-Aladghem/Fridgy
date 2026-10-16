using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FridgyApi.Migrations
{
    /// <inheritdoc />
    public partial class fixChatSigntureNameInNotificationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ChatId",
                table: "Notifications",
                newName: "ChatSignture");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ChatSignture",
                table: "Notifications",
                newName: "ChatId");
        }
    }
}
