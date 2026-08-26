import logging
from typing import Optional
from neo4j import GraphDatabase, Driver
from .config import settings

logger = logging.getLogger("nexus-intel.database")

class Neo4jManager:
    def __init__(self):
        self._driver: Optional[Driver] = None
        self._is_connected: bool = False

    def connect(self) -> bool:
        if not settings.NEO4J_URI or not settings.NEO4J_PASSWORD:
            logger.info("Neo4j credentials not configured. Operating in high-performance NetworkX in-memory mode.")
            self._is_connected = False
            return False

        try:
            self._driver = GraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USERNAME, settings.NEO4J_PASSWORD),
                max_connection_pool_size=settings.NEO4J_MAX_CONNECTION_POOL_SIZE
            )
            # Verify connectivity
            self._driver.verify_connectivity()
            self._is_connected = True
            logger.info(f"Successfully connected to Neo4j instance at {settings.NEO4J_URI}")
            self._initialize_schema()
            return True
        except Exception as e:
            logger.warning(f"Could not connect to Neo4j at {settings.NEO4J_URI}: {e}. Falling back to NetworkX graph engine.")
            self._driver = None
            self._is_connected = False
            return False

    def _initialize_schema(self):
        """Creates uniqueness constraints on node IDs if connected to Neo4j."""
        if not self._is_connected or not self._driver:
            return

        labels = ["Person", "Phone", "Account", "Location", "Organization", "Vehicle"]
        with self._driver.session(database=settings.NEO4J_DATABASE) as session:
            for label in labels:
                try:
                    session.run(f"CREATE CONSTRAINT IF NOT EXISTS FOR (n:{label}) REQUIRE n.id IS UNIQUE")
                except Exception as e:
                    logger.debug(f"Constraint creation note: {e}")

    @property
    def driver(self) -> Optional[Driver]:
        return self._driver

    @property
    def is_connected(self) -> bool:
        return self._is_connected

    def close(self):
        if self._driver:
            self._driver.close()
            self._is_connected = False
            logger.info("Closed Neo4j driver connection.")

db_manager = Neo4jManager()
