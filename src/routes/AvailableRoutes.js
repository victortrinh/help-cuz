/**
 * STEP 2: REMOVING UNUSED IMPORTS
 * 
 * Don't think I need to explain this one. 🙈
 */

import {AttachMoney, DirectionsBike, KeyboardArrowRight, LocalMall} from '@material-ui/icons';
import { Grid, Typography, } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import React, { useEffect, useState } from "react";

import Moment from "react-moment";

import {NavLink} from "react-router-dom";

import axios from "axios";

import Spinner from "../../../Components/Spinner";
import {SecondsToDurationStringConverter} from "../../../Shared/Utils";

/**
 * STEP 3 : IMPORTING THE STYLES 💡
 * 
 * Now you can reuse this everywhere.
 * 
 * Preferably the styling you are importing will only contain the classes you need.
 */

/**
 * STEP 4 : TRANSFORMING FOR THE FUTURE
 * 
 * You should always try to use FunctionComponent instead of Component / PureComponent to be able to use React's latest "Hooks".
 */
const AvailableRoutes  = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const classes = useStyles();
  const bullet = <span class="info-separator">•</span>;

  useEffect(() => {
    const fetchRoutes = async() => {
      console.log("trying to fetch available routes");

      await axios.get('/apps/cyclist/get_available_routes/', {
        params: {}
      })
      .then(res => {
        const routes = res.data;

        setRoutes(routes);
        setLoading(false);
  
        console.log(routes);
      })
      .catch(err => {
        setLoading(false);
        displayAjaxError(err);
      });
    };

    fetchRoutes();
  }, [])

  return (
    <Grid item container direction="column">
      {loading ?
        <Spinner/>
        :
        <List csubheader={<li/>}>
          {routes.length > 0 ? (
            routes.map((route) => (
              <ListItem key={route.id}>
                {
                  /**
                   * STEP 3 : Inline styling is a big no-no and makes me wanna cry 🐛
                   * 
                   * This is everywhere 😭
                   * 
                   * Everywhere that there's a style={{}}, the styling should be moved to AvailableRoutes.styles.js
                   */
                  }
                <Card className={classes.card} component={NavLink} to={`/cyclist/preview/${route.id}/`}>
                  <CardContent className={classes.cardContent}>

                    <Grid container direction="row" style={{alignItems: "center"}}>

                      <Grid item container sm style={{flex: 1}}>
                        <Grid direction="column" style={{flex: 1}}>
                          <Grid container className={classes.routeHeader}>
                            {route.planned_pickup_datetime ?
                              <React.Fragment>
                                <Typography item style={{flex: 1}}>
                                  <Moment format="MMM Do">{route.planned_pickup_datetime}</Moment>
                                  <br/>
                                  <Moment format="h:mm a" className={classes.routeIdentifier}>{route.planned_pickup_datetime}</Moment>
                                </Typography>
                              </React.Fragment>
                              :
                              <Typography/>
                              /*route.is_ready_for_delivery ?
                                  <Typography className={classes.routeIdentifier}>Route<br/>not planned yet</Typography>
                                  :
                                  <Typography className={classes.routeIdentifier}>Route<br/>not ready</Typography>*/
                            }

                            <Typography variant="body2" item style={{flex: 1, textAlign: "right", color: "#666", fontSize: 12, fontWeight: 500}}>Route #{route.id}</Typography>
                          </Grid>

                          <Grid container direction="row">
                            <CardMedia image={route.map_image_url} class={classes.mapPreview}/>

                            <Grid>
                              <Typography className={classes.routeInfo}>
                                <LocalMall className={classes.icon}/>
                                {route.num_shipments}
                              </Typography>

                              <Typography className={classes.routeInfo}>
                                <DirectionsBike className={classes.icon}/>
                                {SecondsToDurationStringConverter(route.planned_duration_s)}
                                {bullet}
                                {(route.planned_distance_m / 1000).toFixed(2)} km
                              </Typography>

                              <Typography className={classes.routeInfo}>
                                <AttachMoney className={classes.icon}/>
                                {route.estimated_payout_amount} $
                              </Typography>
                            </Grid>
                          </Grid>

                        </Grid>

                      </Grid>

                      <Grid item>
                        <KeyboardArrowRight color="primary"/>
                      </Grid>

                    </Grid>

                  </CardContent>
                </Card>
              </ListItem>
            ))) : (
            <Grid style={{textAlign: "center", padding: 32}}>
              <Typography style={{fontSize: 16, color: "#999"}}>No available routes</Typography>
            </Grid>
          )}
        </List>
      }
    </Grid>
  );
}

export default AvailableRoutes;
