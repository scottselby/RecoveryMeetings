using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MyFirstGoogleMapAPI.Models;

namespace MyFirstGoogleMapAPI.Controllers
{
    public class JSONController : Controller
    {
        public ActionResult GetMarkers()
        {
            List<MarkerPoint> markerPoints = new List<MarkerPoint>();
            float latitude = 42.1159675F;
            float longitude = -87.7429416F;
            
            // creating mock points - this will actually come from query to db
            for(int i = 0; i <= 6; i++){
                MarkerPoint marker = new MarkerPoint()
                {
                    Title = "MyPoint" + i.ToString(),
                    Latitude = latitude,
                    Longitude = longitude
                };
                latitude -= .007F;
                longitude -= .007F;
                markerPoints.Add(marker);
            }
            return this.Json(markerPoints, JsonRequestBehavior.AllowGet); // Remove this yo
        }

    }
}
