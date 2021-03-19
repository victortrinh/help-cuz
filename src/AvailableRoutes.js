import React from "react";
import {Container, Grid, IconButton, Toolbar, Typography,} from '@material-ui/core';
import {Place, KeyboardArrowRight, DirectionsBike, AttachMoney, LocalMall} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Moment from "react-moment";
import {NavLink} from "react-router-dom";
import {SecondsToDurationStringConverter} from "../../../Shared/Utils";
import Spinner from "../../../Components/Spinner";

const styles = theme => ({
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
      this.props.displayAjaxError(err);
    });
  }


  render() {
    const bullet = <span class="info-separator">•</span>;

    return (
      <Grid item container direction="column">
        {this.state.loading ?
          <Spinner/>
          :
          <List csubheader={<li/>}>
            {this.state.routes.length > 0 ? (
              this.state.routes.map((route) => (
                <ListItem key={route.id}>
                  <Card style={{flex: 1, textDecoration: "none"}} component={NavLink} to={`/cyclist/preview/${route.id}/`}>
                    <CardContent className={this.props.classes.card}>

                      <Grid container direction="row" style={{alignItems: "center"}}>

                        <Grid item container sm style={{flex: 1}}>
                          <Grid direction="column" style={{flex: 1}}>
                            <Grid container className={this.props.classes.routeHeader}>
                              {route.planned_pickup_datetime ?
                                <React.Fragment>
                                  <Typography item style={{flex: 1}}>
                                    <Moment format="MMM Do">{route.planned_pickup_datetime}</Moment>
                                    <br/>
                                    <Moment format="h:mm a" className={this.props.classes.routeIdentifier}>{route.planned_pickup_datetime}</Moment>
                                  </Typography>
                                </React.Fragment>
                                :
                                <Typography/>
                                /*route.is_ready_for_delivery ?
                                    <Typography className={this.props.classes.routeIdentifier}>Route<br/>not planned yet</Typography>
                                    :
                                    <Typography className={this.props.classes.routeIdentifier}>Route<br/>not ready</Typography>*/
                              }

                              <Typography variant="body2" item style={{flex: 1, textAlign: "right", color: "#666", fontSize: 12, fontWeight: 500}}>Route #{route.id}</Typography>
                            </Grid>

                            <Grid container direction="row">
                              <CardMedia image={route.map_image_url} class={this.props.classes.mapPreview}/>

                              <Grid>
                                <Typography className={this.props.classes.routeInfo}>
                                  <LocalMall className={this.props.classes.icon}/>
                                  {route.num_shipments}
                                </Typography>

                                <Typography className={this.props.classes.routeInfo}>
                                  <DirectionsBike className={this.props.classes.icon}/>
                                  {SecondsToDurationStringConverter(route.planned_duration_s)}
                                  {bullet}
                                  {(route.planned_distance_m / 1000).toFixed(2)} km
                                </Typography>

                                <Typography className={this.props.classes.routeInfo}>
                                  <AttachMoney className={this.props.classes.icon}/>
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