/** Properties required to construct a Report entity. */
export interface ReportProps {
  id: string;
  fileId: string;
  rowCount: number;
  columnCount: number;
  columnNames: string[];
  columnTypes: Record<string, string>;
  emptyCountPerColumn: Record<string, number>;
  previewRows: Record<string, unknown>[];
  errorMessage?: string | null;
  createdAt: Date;
}

/** Domain entity representing a generated CSV profile report. */
export class Report {
  readonly id: string;
  readonly fileId: string;
  readonly rowCount: number;
  readonly columnCount: number;
  readonly columnNames: string[];
  readonly columnTypes: Record<string, string>;
  readonly emptyCountPerColumn: Record<string, number>;
  readonly previewRows: Record<string, unknown>[];
  readonly errorMessage: string | null;
  readonly createdAt: Date;

  private constructor(props: ReportProps) {
    this.id = props.id;
    this.fileId = props.fileId;
    this.rowCount = props.rowCount;
    this.columnCount = props.columnCount;
    this.columnNames = props.columnNames;
    this.columnTypes = props.columnTypes;
    this.emptyCountPerColumn = props.emptyCountPerColumn;
    this.previewRows = props.previewRows;
    this.errorMessage = props.errorMessage ?? null;
    this.createdAt = props.createdAt;
  }

  /** Factory method with basic validation. */
  static create(props: ReportProps): Report {
    if (!props.id) throw new Error('Report id is required');
    if (!props.fileId) throw new Error('File id is required');
    if (props.rowCount < 0) throw new Error('Row count cannot be negative');
    if (props.columnCount < 0) throw new Error('Column count cannot be negative');
    return new Report(props);
  }
}
