using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningStarter.Migrations
{
    /// <inheritdoc />
    public partial class SyncPracticeAttempt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "PracticeAttempts",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PracticeAttempts_UserId",
                table: "PracticeAttempts",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PracticeAttempts_AspNetUsers_UserId",
                table: "PracticeAttempts",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PracticeAttempts_AspNetUsers_UserId",
                table: "PracticeAttempts");

            migrationBuilder.DropIndex(
                name: "IX_PracticeAttempts_UserId",
                table: "PracticeAttempts");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "PracticeAttempts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
