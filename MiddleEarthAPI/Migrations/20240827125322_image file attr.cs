using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiddleEarthAPI.Migrations
{
    /// <inheritdoc />
    public partial class imagefileattr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Characters",
                newName: "ImageName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageName",
                table: "Characters",
                newName: "ImageUrl");
        }
    }
}
