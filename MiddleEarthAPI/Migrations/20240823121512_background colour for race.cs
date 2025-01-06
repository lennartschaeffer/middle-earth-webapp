using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiddleEarthAPI.Migrations
{
    /// <inheritdoc />
    public partial class backgroundcolourforrace : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BackGroundColour",
                table: "Races",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BackGroundColour",
                table: "Races");
        }
    }
}
