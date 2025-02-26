
export interface CustomerTag {
  id: string;
  name: string;
  color: string | null;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string | null;
  criteria: Record<string, string>;
}

export interface TagAssignment {
  tag: CustomerTag;
}

export interface SegmentAssignment {
  segment: CustomerSegment;
}
