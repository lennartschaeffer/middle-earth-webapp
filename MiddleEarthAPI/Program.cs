using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using MiddleEarthAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddDbContext<CharacterDbContext>(options=>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MiddleEarthConnectionString")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
builder.Services.AddCors();

app.UseStaticFiles(new StaticFileOptions
{
        FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "Images")),
        RequestPath = "/Images"
});
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();