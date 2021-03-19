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
        flex: 1, textDecoration: "none"
    },
    cardContent: {
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