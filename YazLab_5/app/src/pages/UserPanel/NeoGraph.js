import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Neovis from "neovis.js/dist/neovis.js";
import axios from 'axios'

const NeoGraph = props => {
  const {
    width,
    height,
    containerId,
    backgroundColor,
    neo4jUri,
    neo4jUser,
    neo4jPassword,
    initial_cypher,
    setCypher,
    generateCypher
  } = props;

  const visRef = useRef();

  useEffect(() => {
    const config = {
      container_id: visRef.current.id,
      server_url: neo4jUri,
      server_user: neo4jUser,
      server_password: neo4jPassword,
      arrows : false,
      labels: {
        Author: {
          caption: "fullname",
          size: 3.0,
          font : {
            size : 15,
          }
        },
        Publication : {
          caption: "publication_id",
          size: 1.0,
          font : {
            size : 10
          }
        },
        Publisher: {
          caption: "name",
          size: 1.5,
          font : {
            size : 10
          }
        },
      },
      relationships: {
        YAYIN_YAZARI: {
          captions: "name",
          thickness: "count",
        },
        ORTAK_ÇALIŞIR:{
          captions: "name",
          thickness: "count",
        },
        YAYINLANIR:{
          captions: "name",
          thickness: "count",
        },
      },
      initial_cypher: initial_cypher
    };
    const vis = new Neovis(config);
    vis.render();
  
    vis.registerOnEvent("completed", (e)=>{ 
      vis["_network"].on("click", (event)=>{ 
          console.log(event.nodes[0]);

          axios.get('/get_by_id/'+event.nodes[0]).then(res => {
            console.log(res.data);
            console.log(res.data.labels[0])
            if(res.data.labels[0] === "Author"){
              props.setCypher(props.generateCypher(res.data.properties.fullname))
            }
            console.log(res.data.properties.fullname)
          })
          });
    });
  
  }, [neo4jUri, neo4jUser, neo4jPassword, initial_cypher, setCypher, props]);

  return (
    <div
      id={containerId}
      ref={visRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: `${backgroundColor}`,
      }}
    />
  );
};

NeoGraph.defaultProps = {
  width: 1200,
  height: 400,
  backgroundColor: "#d3d3d3",
};

NeoGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  containerId: PropTypes.string.isRequired,
  neo4jUri: PropTypes.string.isRequired,
  neo4jUser: PropTypes.string.isRequired,
  neo4jPassword: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
};

const ResponsiveNeoGraph = props => {

  const neoGraphProps = { ...props, width: window.innerWidth * 0.9,
    height: window.innerHeight * 0.7 };
  return (
    <div style={{ position: "relative" }}>
      <NeoGraph {...neoGraphProps} />
    </div>
  );
};

ResponsiveNeoGraph.defaultProps = {
  backgroundColor: "#d3d3d3",
};

ResponsiveNeoGraph.propTypes = {
  containerId: PropTypes.string.isRequired,
  neo4jUri: PropTypes.string.isRequired,
  neo4jUser: PropTypes.string.isRequired,
  neo4jPassword: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
};

export { NeoGraph, ResponsiveNeoGraph };
