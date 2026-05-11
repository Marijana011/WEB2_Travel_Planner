using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelService.Migrations
{
    /// <inheritdoc />
    public partial class AddActivities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activitys_Trips_TripId",
                table: "Activitys");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Activitys",
                table: "Activitys");

            migrationBuilder.RenameTable(
                name: "Activitys",
                newName: "Activities");

            migrationBuilder.RenameIndex(
                name: "IX_Activitys_TripId",
                table: "Activities",
                newName: "IX_Activities_TripId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Activities",
                table: "Activities",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_Trips_TripId",
                table: "Activities",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Trips_TripId",
                table: "Activities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Activities",
                table: "Activities");

            migrationBuilder.RenameTable(
                name: "Activities",
                newName: "Activitys");

            migrationBuilder.RenameIndex(
                name: "IX_Activities_TripId",
                table: "Activitys",
                newName: "IX_Activitys_TripId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Activitys",
                table: "Activitys",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Activitys_Trips_TripId",
                table: "Activitys",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
