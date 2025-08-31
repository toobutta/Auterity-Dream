# Query Builder Components

This directory contains modular components for building a no-code database query interface within Auterity's workflow builder.

## Components

### TableSelector

A component for selecting database tables and their columns.

**Props:**

- `onTableSelect`: Callback when a table is selected
- `onColumnSelect`: Callback when columns are selected/deselected
- `selectedTable`: Currently selected table
- `selectedColumns`: Currently selected columns

**Features:**

- Searchable table list
- Column selection with visual indicators
- Primary key and foreign key indicators
- Row count display

### QueryPreview

A component for displaying query results and execution status.

**Props:**

- `query`: The SQL query string to display
- `onExecute`: Function to execute the query and return results
- `isExecuting`: Loading state indicator
- `maxRows`: Maximum rows to display initially

**Features:**

- Query syntax highlighting
- Result table with pagination
- Execution time and row count display
- Error handling and display

### QueryEditor

A component for building queries through a visual interface.

**Props:**

- `selectedTable`: The table to query
- `selectedColumns`: Columns to include in the query
- `onQueryChange`: Callback when the generated query changes
- `onFiltersChange`: Callback when filters change
- `onSortChange`: Callback when sort order changes
- `onAggregationChange`: Callback when aggregations change

**Features:**

- Visual filter builder
- Sort configuration
- Aggregation functions (COUNT, SUM, AVG, etc.)
- Query limit setting
- Real-time SQL generation

## Usage Example

```tsx
import { TableSelector, QueryEditor, QueryPreview } from './components/query-builder';

function QueryBuilderPage() {
  const [selectedTable, setSelectedTable] = useState();
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecuteQuery = async () => {
    setIsExecuting(true);
    try {
      const result = await executeQuery(generatedQuery);
      return result;
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <TableSelector
        onTableSelect={setSelectedTable}
        onColumnSelect={setSelectedColumns}
        selectedTable={selectedTable}
        selectedColumns={selectedColumns}
      />

      <QueryEditor
        selectedTable={selectedTable?.name}
        selectedColumns={selectedColumns.map(col => col.name)}
        onQueryChange={setGeneratedQuery}
        onFiltersChange={() => {}}
        onSortChange={() => {}}
        onAggregationChange={() => {}}
      />

      <QueryPreview
        query={generatedQuery}
        onExecute={handleExecuteQuery}
        isExecuting={isExecuting}
      />
    </div>
  );
}
```

## Integration with Workflow Builder

These components are designed to integrate seamlessly with the workflow builder:

1. **Table Selection**: Users select tables and columns to define data sources
2. **Query Building**: Visual query builder generates SQL for data transformation nodes
3. **Preview**: Real-time query execution and result preview
4. **Workflow Integration**: Generated queries can be attached to workflow nodes

## API Integration

The components expect the following API endpoints:

- `GET /api/tables` - List available tables
- `GET /api/tables/{tableName}` - Get table schema and metadata
- `POST /api/query/execute` - Execute a query and return results

## Future Enhancements

- Support for JOIN operations
- Advanced filtering with date ranges and complex conditions
- Query templates and saved queries
- Integration with external data sources (APIs, files, etc.)
- Query performance optimization suggestions
