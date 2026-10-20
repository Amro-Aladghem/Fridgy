using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FridgyApi.Migrations
{
    /// <inheritdoc />
    public partial class AddChatAgentType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AgentType",
                table: "Chats",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AgentType",
                table: "Chats");
        }
    }
}
