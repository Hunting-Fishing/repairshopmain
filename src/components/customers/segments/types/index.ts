
export interface Segment {
  id: string;
  name: string;
  description: string | null;
  criteria: any;
}

export interface Tag {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
}

export interface SegmentAssignment {
  segment: Segment;
}

export interface TagAssignment {
  tag: Tag;
}
