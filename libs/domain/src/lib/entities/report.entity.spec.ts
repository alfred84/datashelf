import { Report } from './report.entity';

describe('Report Entity', () => {
  const validProps = {
    id: 'report-uuid',
    fileId: 'file-uuid',
    rowCount: 100,
    columnCount: 5,
    columnNames: ['name', 'age', 'email', 'city', 'active'],
    columnTypes: { name: 'string', age: 'number', email: 'string', city: 'string', active: 'boolean' },
    emptyCountPerColumn: { name: 0, age: 2, email: 1, city: 5, active: 0 },
    previewRows: [
      { name: 'Alice', age: 30, email: 'alice@test.com', city: 'NYC', active: true },
    ],
    createdAt: new Date(),
  };

  it('should create a valid report', () => {
    const report = Report.create(validProps);
    expect(report.id).toBe('report-uuid');
    expect(report.rowCount).toBe(100);
    expect(report.columnCount).toBe(5);
    expect(report.errorMessage).toBeNull();
  });

  it('should include error message when provided', () => {
    const report = Report.create({ ...validProps, errorMessage: 'parse error' });
    expect(report.errorMessage).toBe('parse error');
  });

  it('should reject missing id', () => {
    expect(() => Report.create({ ...validProps, id: '' })).toThrow(
      'Report id is required'
    );
  });

  it('should reject missing file id', () => {
    expect(() => Report.create({ ...validProps, fileId: '' })).toThrow(
      'File id is required'
    );
  });

  it('should reject negative row count', () => {
    expect(() => Report.create({ ...validProps, rowCount: -1 })).toThrow(
      'Row count cannot be negative'
    );
  });

  it('should reject negative column count', () => {
    expect(() => Report.create({ ...validProps, columnCount: -1 })).toThrow(
      'Column count cannot be negative'
    );
  });
});
