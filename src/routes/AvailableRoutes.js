/**
 * STEP 2: REMOVING UNUSED IMPORTS
 * 
 * Don't think I need to explain this one. 🙈
 */

import {AttachMoney, DirectionsBike, KeyboardArrowRight, LocalMall, Place} from '@material-ui/icons';
import { Grid, Typography, } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {withStyles} from '@material-ui/core/styles';

import Moment from "react-moment";

import {NavLink} from "react-router-dom";

import React from "react";

import axios from "axios";

import Spinner from "../../../Components/Spinner";
import {SecondsToDurationStringConverter} from "../../../Shared/Utils";

export const styles = theme => ({
  routeHeader: {
    marginBottom: 16,
  },
  routeIdentifier: {
    fontSize: 16,
    fontWeight: 500,
    color: "#444"
  },
  routeInfo: {
    fontSize: 16,
    color: "#444"
  },
  icon: {
    fontSize: 16,
    color: '#ccc',
    marginRight: 4,
    marginBottom: 4
  },
  card: {
    padding: 12,
    "&:last-child": {
      paddingBottom: 12
    }
  },
  actionContainer: {
    alignItems: "flex-end",
    paddingTop: 8,
    marginTop: 16,
    borderTop: "1px solid #efefef"
  },
  mapPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundSize: "cover"
  },
});

class AvailableRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [],
      loading: true,
    };
  }

  componentDidMount() {
    console.log("trying to fetch available routes");
    this.fetchRoutes();
  }

  /* FETCHING */
  fetchRoutes() {
    const {displayAjaxError} = this.props;

    this.setState({loading: true});

    axios.get('/apps/cyclist/get_available_routes/', {
      params: {}
    })
    .then(res => {
      this.setState({
        routes: res.data.routes,
      });

      this.setState({loading: false});
      console.log(res.data.routes);
    })
    .catch(err => {
      this.setState({loading: false});
      displayAjaxError(err);
    });
  }


  render() {
    /***
     * STEP 1 : DESTRUCTURING THE PROPS  
     * STEP 2 : DESTRUCTURING THE STATE
     * 
     * So we don't repeat "this.props" and "this.state" everywhere 
     */
    const { classes } = this.props;
    const { loading, routes } = this.state;
    const bullet = <span class="info-separator">•</span>;

    return (
      <Grid item container direction="column">
        {loading ?
          <Spinner/>
          :
          <List csubheader={<li/>}>
            {routes.length > 0 ? (
              routes.map((route) => (
                <ListItem key={route.id}>
                  <Card style={{flex: 1, textDecoration: "none"}} component={NavLink} to={`/cyclist/preview/${route.id}/`}>
                    <CardContent className={classes.card}>

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

}

export default withStyles(styles)(AvailableRoutes)
